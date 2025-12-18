Came back to this code after a year or 2, need some refresher, can look at this for refresher
---

- getData(jsonData, prefix)
jsonData: Data read from file parsed
PREFIX is input, empty for now


## Recursive structure in postman v2 json

The following structure makes the types generation possible

### Postman V2 Collection Schema
```
{
    info: {} # Info about the collection, can be ignored
    item: [] # Recursive structure that is of interest to us
}

```
## About item
- property with item can be a folder, which in turn has requests by `item` property, which has things like
    - method
    - header
        - key & value
    - body
        - has mode as raw for `json`
        - inside raw there is our raw json
    - url
        - has raw
        - path list
        - variable list: not useful to us as, we shouldn't replace value
    - Response: For Example of saved responses
        - name: Name of saved response
        - originalRequest
            - method
            - header
            - body: **with raw property, determine interface**
            - url: **with raw property to display as output interface url**
        - body: Example of saved response


We read and then parse json for this collection as json **jsonData**used below for reference


-  jsonData.item -> is accessed in start.
    - item[] is a array of objects can be folder or request
    - name: names folder/request

- Since name is an array, it is accessed and each of the elements is sent recursively to again to `getData()` as `getData(i, prefix) for i in item`

So, when recurion stops, we can assume that we have a single requestcollected with all the request/response data with us.

## Type determination

Now for each request/resp data, we get the following:

### Request property
Parse TS Types from postman request json body

## Raw JSON example to type determination

### Parse type from request json body
Args: name of req, req, prefix

Only works with request json raw body

1. method
2. url
3. Get the ts type from raw json
    - If the raw type is array and has length > 0, then take the first element as object, as each element must have same type defination
    - Then get equivalent type for variable(key), mostly type matching + array or json object treated recursively, each depth adds some tab (signifying nested tabs)

### Parse type from response examples

Only works for request responses examples. For each example do the following

1. method
2. url
3. Get the ts type from raw json
    - If the raw type is array and has length > 0, then take the first element as object, as each element must have same type defination
    - Then get equivalent type for variable(key), mostly type matching + array or json object treated recursively, each depth adds some tab (signifying nested tabs)
