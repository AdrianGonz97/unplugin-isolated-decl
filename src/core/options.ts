import type { FilterPattern } from '@rollup/pluginutils'
import type { TranspileOptions } from 'typescript'

export type Options = {
  include?: FilterPattern
  exclude?: FilterPattern
  enforce?: 'pre' | 'post' | undefined
  ignoreErrors?: boolean
  /** An extra directory layer for output files. */
  extraOutdir?: string
} & (
  | {
      /**
       * `oxc-transform` or `@swc/core` should be installed yourself
       * if you want to use `oxc` or `swc` transformer.
       */
      transformer?: 'oxc' | 'swc'
    }
  | {
      /**
       * `typescript` should be installed yourself.
       * @default 'typescript'
       */
      transformer: 'typescript'
      /** Only for typescript transformer */
      transformOptions?: TranspileOptions
    }
)

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export type OptionsResolved = Overwrite<
  Required<Options>,
  Pick<Options, 'enforce' | 'extraOutdir'>
>

export function resolveOptions(options: Options): OptionsResolved {
  return {
    include: options.include || [/\.[cm]?ts$/],
    exclude: options.exclude || [/node_modules/],
    enforce: 'enforce' in options ? options.enforce : 'pre',
    transformer: options.transformer || 'typescript',
    ignoreErrors: options.ignoreErrors || false,
    extraOutdir: options.extraOutdir,
  }
}
