import commerce from "apps/commerce/mod.ts";
import { Props as WebsiteProps } from "apps/website/mod.ts";
import { Section } from "deco/blocks/section.ts";
import type { App as A, AppContext as AC } from "deco/mod.ts";
import { rgb24 } from "std/fmt/colors.ts";
import manifest, { Manifest } from "../manifest.gen.ts";

export interface Props extends WebsiteProps {
  /**
   * @title Active Commerce Platform
   * @description Choose the active ecommerce platform
   * @default custom
   */
  platform: Platform;
  theme?: Section;
}

export type Platform =
  | "vtex"
  | "vnda"
  | "shopify"
  | "wake"
  | "nuvemshop"
  | "custom";

export let _platform: Platform = "custom";

export type App = ReturnType<typeof Site>;
// @ts-ignore somehow deno task check breaks, I have no idea why
export type AppContext = AC<App>;

let firstRun = true;

type WebsiteApp = ReturnType<typeof commerce>;

/**
 * @title Site
 * @description Start your site from a template or from scratch.
 * @category Tool
 * @logo https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1/0ac02239-61e6-4289-8a36-e78c0975bcc8
 */
export default function Site(
  { ...state }: Props,
): A<Manifest, Props, [WebsiteApp]> {
  _platform = state.platform || "custom";

  // Prevent console.logging twice
  if (firstRun) {
    firstRun = false;
    console.info(
      ` ${rgb24("Storefront", 0x212121)} | ${rgb24(_platform, 0x212121)} \n`,
    );
  }

  return {
    state,
    manifest,
    dependencies: [
      commerce(state),
    ],
  };
}

export { onBeforeResolveProps, Preview } from "apps/website/mod.ts";
