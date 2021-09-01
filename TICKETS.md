# QA has submitted the following tickets

## Filtering Orders
### QA Notes
When getting all orders filtered by a property, the orders are not being filtered at all. I tried filtering the orders by name for any order that was an "Additional Topping" but I'm getting all orders back.

### Tips
For query params you will want to assume `filterProperty` is "name" and `filterValue` is "Additional Topping".

### Dev Notes / Response

I understood and order is an object element (with id, name, items, and total), so initially, it wasn't receiving the correct params to make the query/filter. I changed the way to retrieve the query params and validate them. If is there a param it will respond to the entire order with the specific property on the item, otherwise, this will respond to all the orders. (in terms of HTTP methods, we're using the same GET to trigger one or all orders)

---


## Placing An Order
### QA Notes
When testing an order for a family of 6, the total is not as expected. I placed an order for the following: 

    - 2 Cheeseburgers
    - 2 Pickle Toppings
    - 1 Large Fiesta Salad
    - 3 Avocado Toppings
    - 1 Medium Hawaiian Pizza
    - 3 Medium French Fries
    - 4 Large Fountain Drinks

I calculated that the total should be $74.23 but I'm getting $51.28. Because that's a difference of $22.95, I have a feeling the "Medium Hawaiian Pizza" isn't being added.

### Tips
All items ordered (and more) can be referenced in lib/orders.js

### Dev Notes / Response
Everything was updating well here, the problem was while the function was doing the total, it was only taking one single price, not the price and the quantity. The tester suggested it maybe wasn't considerating a medium pizza, but in fact, it wasn't multiplying by the quantity of each item on the order.

---


## Updating An Order --
### QA Notes
When getting updating an order I expect to only have to pass what has changed. However, if I don't pass everything (customerName or items), that value gets removed. If for instance I did not change the customer name, I would expect it to use the one originally on the order.

Additionally, when updating the items ordered, the total is not updating.

### Dev Notes / Response

Here, the function was sending back all the updated info, without the not modified. So, I created a method to find the item by id, and update it, also, if the quantity changed as well, I modified the total and finally send all the order information.
---


## Deleting An Order --
### QA Notes
When  I delete an order, the order that gets deleted is never the one I expect. I know we recently changed how we are doing our deletes so I'm not sure everything got updated. But when I delete a specific order, that's usually not the one that gets deleted. Unless I delete it immediately.

### Dev Notes / Response

This method suggests retrieving an ID and deletes it, but the previous code deletes the oldest order based only on the dates on file, never looking at the id nor other parameters sent. so I rebuilt the method and "Delete" the order with the ID specified and keeping the same validation if the ID exists.

---


## Other

I found an error on the information source, on the first order, the total order amount was named as "price", which I assumed was an error due to all the other orders is named as Total.
