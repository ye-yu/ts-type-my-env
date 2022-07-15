# type-my-env

Autocomplete your environment variables! This utility file is a great tool
to enhance your .env integration with your project.

Usage example:
```bash
npx type-my-env
```

This will generate a `type-my-env.d.ts` file in the `types` directory. To enable autocomplete
from the new type definitions, add the directory `types` to the `typeRoots` compiler options
in your `tsconfig.json` file.

Sample `.env`:

```bash
APP_NAME=nodejs
# Set to dev or debug for local envinroment
APP_ENV=prod
# The app key for authentication token generation
# You can also comment on multiple line.
APP_KEY=base64:FSTR8I8jRoTdBaEIDRSd5xKbGKibzOAYUKH8tKmr4o4= # is also accept inline, but this will not appear in the JSDoc
APP_DEBUG=true
APP_URL=http://localhost:3200/
```

The `type-my-env.d.ts` will contain:

```ts
declare namespace NodeJS {
  export interface Process {
    env: {
      /**
       * Can be used to change the default timezone at runtime
       */
      TZ?: string;

      APP_NAME?: string;

      /**
       * Set to dev or debug for local envinroment
       *
       * The infered type is string.
       */
      APP_ENV?: string;

      /**
       * The app key for authentication token generation
       * You can also comment on multiple line.
       *
       * The infered type is string.
       */
      APP_KEY?: string; // is also accept inline, but this will not appear in the JSDoc

      APP_DEBUG?: string;

      APP_URL?: string;
    };
  };
}
```

Now, whenever you type your `process.env.` in your code editor, you will benefit
from the typings autocomplete!

![autocomplete](https://imgur.com/jxR2XrI.png)