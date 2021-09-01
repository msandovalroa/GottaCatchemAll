const Router = require("koa-router");
const uuid = require("uuid").v4;

const ordersRouter = new Router({ prefix: "/orders" });
const ordersData = require("../lib/orders");

ordersRouter.post("/", async (ctx) => {
  const { customerName, items } = ctx.request.body;

  if (!items.length) {
    ctx.throw(409, "No items ordered");
  }

  const total = items.reduce((orderTotal, item) => (orderTotal += item.price * item.quantity),0);

  const order = {
    id: uuid(),
    customerName,
    createdOn: new Date(),
    items,
    total
  };

  ctx.status = 201;
  ctx.body = [...ordersData, order];
});

ordersRouter.get("/", async (ctx) => {
  const filterProperty = Object.keys(ctx.request.query)[0];
  const filterValue = Object.values(ctx.request.query)[0];
  //const { filterProperty, filterValue } = ctx.query;   --> old method

 
  let results = ordersData;

  if (filterProperty && filterValue) {
    const filteredResults = ordersData.filter(({ items }) => 
        items.find(item => item[filterProperty].includes(filterValue)) 
    )
    results = filteredResults;
  }

  ctx.status = 200;
  ctx.body = results;
});

ordersRouter.get("/:id", async (ctx) => {
  const { id } = ctx.params;
  const order = ordersData.find((order) => order.id === id);

  if (!order) {
    ctx.throw(404, "Order not found");
  }

  ctx.status = 200;
  ctx.body = order;
});

ordersRouter.put("/:id", async (ctx) => {
  const { id } = ctx.params;
  const { customerName, items } = ctx.request.body;

  const order = ordersData.find((order) => order.id === id);

  if (!order) {
    ctx.throw(404, "Could not find order");
  }

  // update name
  if (customerName) {
    order.customerName = customerName;
  }

  // update items if exists
  items.forEach(item => {
    order.items.forEach(it => {
      if(item.id == it.id) {
        it.quantity += item.quantity;
        order.total += item.quantity * item.price;
      }
    });
  });

  const updated = {
    ...order,
  };

  ctx.status = 200;
  ctx.body = updated;
});


ordersRouter.delete("/:id", async (ctx) => {
  const { id } = ctx.params;

  const order = ordersData.find((order) => order.id === id);

  if (!order) {
    ctx.throw(404, "Could not find order");
  }

  /*****
   * I removed this method
   *const latest = ordersData.reduce((a, b) => (a.createdOn > b.createdOn ? a : b));
   */

  const remaining = ordersData.filter((it) => {
    return id != it.id;
  });

  ctx.status = 200;
  ctx.body = remaining;
});

module.exports = ordersRouter;
