# POSTMAN TO TYPESCRIPT

A simple tool built on top of nodejs that scans for all the content of a postman json document and creates interface according to
the examples response output, url request query params and url request query body

## Too bored to read ?
I got you covered 😉

https://github.com/n1rjal/postman-to-typescript/assets/60036262/a1443a38-b0f3-4164-9282-a27756c108f2



## How to use

First of all, you'll either need to
 - export the postman collection [Learn more about it here](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#exporting-collections), or,
 - use remote postman collection, for which you need to have a postman API key and a remote postman collection.
   - To generate your own API key, check [docs](https://learning.postman.com/docs/developer/postman-api/authentication/#generate-a-postman-api-key).
   - To get a remote postman collection, you can either make your workspace [public](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/public-workspaces/) and access your collection remotely, or [explore](https://www.postman.com/explore) public API network.
     A collection url is in the format of `https://www.postman.com/<team>/workspace/<workspace>/collection/<collection-id>`.

Then,
1. Download node version >=16
2. Git clone the repo:

```bash
git clone https://github.com/n1rjal/postman-to-typescript.git
```

3. Change the config file `eator.json` accordingly or you can use the sample type here. The config and index.js file must be in same directory

```bash
node index.js
```

## Use npx

```bash
npx @n1rjal/pm_ts -i postman_collection_v2.json -o types # using input file
```
```bash
npx @n1rjal/pm_ts -X YOUR_API_KEY -U REMOTE_POSTMAN_COLLECTION_URL -o types # using remote postman collection
```

## Command-line Arguments

The script file is most stable for -i and -o flags. Other files may bring unwanted results. And postman form data can perform errors.
`pm_ts` supports the following command-line arguments:

| Argument            | Description                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| -i, --input         | The export of postman data as json v2.0                                                                             |
| -X, --api-key       | This specifies your postman API key                                                                                 |
| -U, --collection-url| This specifies the remote postman collection url                                                                    |
| -o, --output        | The output directory for all types                                                                                  |
| -ia, --include-any  | This specifies if any must be included in typescript types or not. Default value is false                           |
| -sc, --status-codes | This specifies if we can add type support for response of the types provided. Default value is 200[comma separated] |
| -ft, --force-text   | This specifies if we need to parse text content in postman request or not. Default value is false                   |
| -te, --throw-error  | This specifies if the program should throw an error                                                                 |
| -p, --prefix        | This specifies if the output files need prefix                                                                      |

You can use these arguments when running the script or program to provide additional options or information.

## After successful execution

On local run, before your folder structure, should look like this

```bash
.
├── index.js
├── readme.md
├── postman_collection_v2.json
└── types


```

## Interface

Every interface here will have the following format

```typescript
/*
Get all requests from one time to another
GET: {{host}}/report/time-stamps?startDate=05-22-2021&endDate=07-30-2021
*/
export interface GetAllRequestsFromOneTimeToAnother {
  startDate: string;
  endDate: string;
}
```

## Option Flag

The option flags, we have for the command are listed below

This will prompt you for some basic information about your project, such as the project name and the package manager you want to use (`npm` or `yarn`). After providing the required information, `pm_ts` will set up a new TypeScript project for you with the selected package manager.

## Contributing

Please see [CONTRIBUTING.md](https://github.com/bigyanse/postman-to-typescript/blob/main/CONTRIBUTING.md) for contributing guide.

## License

This project is licensed under the [MIT License](LICENSE).

Use this table as a quick reference for understanding the purpose of each field in the configuration file.

## Warning

Note that this project is still in beta stage and might return files with undefined in it every here and there. So feel free to create issues and contribute the project as necessary
