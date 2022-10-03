// Forcibly import quill implementation
import 'quill';

// Perform dark magic so that quill module is properly typed and at the same time works in runtime.
//
// Sample usage:
//
//   // Note convenient { ... } imports instead of `import * from 'quill'`
//   import { Delta, Quill, QuillType } from 'app/shared/quill';
//
//   // Importing auxiliary types is possible, but is rather awkward
//   const _Delta: typeof Delta = Quill.import('delta');
//
//   class SampleQuillModule {
//
//     // Refer to Quill type as `QuillType`
//     constructor(quill: QuillType, options) {
//
//       // Sample usage of the Delta auxiliary type
//       window.setTimeout(() => {
//         quill.updateContents(new _Delta([
//           { insert: 'Hello from SampleQuillModule!' },
//         ]));
//       });
//     }
//   }
//
//   // You can still access Quill statics as Quill.<...>
//   Quill.register(SampleQuillModule);
//
// I did not find a way to merge variable and type declarations so that both are available
// as `Quill`, so I exported the type declaration as `QuillType` to distinguish the two.
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html
//
// Broken Quill typings are a known issue:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18946
//
// The accepted solution is said to only work in certain TypeScript configurations:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18946#issuecomment-331650057
//

// re-export auxiliary type declarations from `@types/quill`
export * from 'quill';

// then we need the actual implementation (note the usage of `QuillImplementation` below)
import * as QuillImplementation from 'quill';

// import quill type declaration from `@types/quill`
import { default as QuillTypescriptClass } from 'quill';

// re-export the type declaration
export type QuillType = QuillTypescriptClass;

// export a variable declaration for accessing Quill statics
export const Quill: typeof QuillTypescriptClass = QuillImplementation as any;