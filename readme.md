# POSTMAN TO TYPESCRIPT

A simple tool built on top of nodejs that scraps all the content of a postman json documents and creates interface according to
the examples response output, url request query params and url request query body

## How to use

> First of all you'll need to export the postman collection. [Learn more about it here](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#exporting-collections)

1. Download node version >=16
2. Git clone the repo:

```bash
git clone https://github.com/n1rjal/postman-to-typescript.git
```

3. Change the config file `eator.json` accordingly or you can use the sample type here. The config and index.js file must be in same directory

```bash
node index.js
```

## After successful execution

Before your folder structure, should look like this

```bash
.
├── eater.json
├── index.js
├── readme.md
├── sample.json
└── types


```

** After successful execution**, you should see your code structure change as

```bash

.
├── eater.json
├── index.js
├── readme.md
├── sample.json
└── types
    ├── queries
    │   ├── IAllOpenRequetsQuery.ts
    │   ├── IGetAllPostsForACompetitionQuery.ts
    │   ├── IGetAllPostsQuery.ts
    │   ├── IGetAllRequestsFromOneTimeToAnotherQuery.ts
    │   ├── IGetFamousHashtagsQuery.ts
    │   ├── IGetLikesToACommentQuery.ts
    │   ├── IGetRepliesToACommentQuery.ts
    │   └── ISearchAUserQuery.ts
    ├── request
    │   ├── IAddAwardsForACompetitionRequest.ts
    │   ├── IAddNewTokenRequest.ts
    │   ├── IAddSponserRequest.ts
    │   ├── ICalculateWinnersRequest.ts
    │   ├── ICommentAPostRequest.ts
    │   ├── IDeleteNotificationRequest.ts
    │   ├── IGetNewAccessTokenUsingRefreshTokenRequest.ts
    │   ├── IRemoveAwardForACompetitionRequest.ts
    │   ├── IRemoveSponserRequest.ts
    │   ├── IReplyToACommentRequest.ts
    │   ├── IReportAPostRequest.ts
    │   ├── ISendNotificationRequest.ts
    │   ├── ISiginUserRequest.ts
    │   ├── IUpdateAwardForACompetitionRequest.ts
    │   ├── IUpdateCommentRequest.ts
    │   ├── IUpdateSponserRequest.ts
    │   └── IUpdateVideoRequest.ts
    └── response
        ├── ICreateACommentResponseBody.ts
        ├── ICreateACompetitionResponseBody.ts
        ├── IDeleteACommentResponseBody.ts
        ├── IErrorInUseCreationResponseBody.ts
        ├── IGetAllCompeditionsResponseBody.ts
        ├── IGetAllPostsResponseBody.ts
        ├── IGetNewAccessTokenUsingRefreshTokenResponseBody.ts
        ├── IGetPostByIDResponseBody.ts
        ├── IPostCreatedSuccessfullyResponseBody.ts
        ├── ISiginFailureResponseBody.ts
        ├── ISuccesfulDeletionResponseBody.ts
        ├── ISuccessfulDeletionResponseBody.ts
        ├── ISuccessfullySignedResponseBody.ts
        ├── ISuccessfullyUpdatedResponseBody.ts
        ├── ITokenUserNotFounResponseBody.ts
        ├── IUnlikeDeleyeAlikeResponseBody.ts
        ├── IUpdaateVideoResponseBody.ts
        ├── IUpdateCommentResponseBody.ts
        └── IUserCreatedSuccessfullyResponseBody.ts

4 directories, 48 files

```

## Interface

Every interface here will have the following format

```typescript
/*
Get all requests from one time to another
GET: {{host}}/report/time-stamps?startDate=05-22-2021&endDate=07-30-2021
*/
export interface IGetAllRequestsFromOneTimeToAnother {
  startDate: string;
  endDate: string;
}
```

## Config file

For the config file, we have used the eater.json as config file. As originally this project was named postman eater.
Here are the meaning of keys of the eater json file

| Field                     | Description                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `file`                    | The location of the Postman export collection JSON file.                                                       |
| `throwError`              | If `true`, the program will throw errors and stop the process in case of exceptions.                           |
| `includeAny`              | If `true`, the program will infer some types as `any` or `unknown`.                                            |
| `outputDir`               | The directory where the TypeScript definitions will be generated.                                              |
| `typesForStatusCode`      | An array of status codes for which TypeScript types will be generated based on the examples in the collection. |
| `forceParsingTextContent` | If `true`, the program will try to parse the text content as JSON. If invalid JSON, an error will be thrown.   |

Use this table as a quick reference for understanding the purpose of each field in the configuration file.

## Warning

Note that this project is still in beta stage and might return files with undefined in it every here and there. So feel free to create issues and contribute the project as necessary

## Contributing

Feel free to contribute to the project

1. Add support for nested json response
2. Add support for form data types
3. Add support for remote postman json via URL
4. Add support for command line arguments
