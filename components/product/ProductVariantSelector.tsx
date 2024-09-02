import type { Product } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import { relative } from "../../sdk/url.ts";
import { useId } from "../../sdk/useId.ts";

interface Props {
  product: Product;
}

const colors: Record<string, string | undefined> = {
  "White": "white",
  "Black": "black",
  "Gray": "gray",
  "LightBlue": "lightblue",
  "DarkBlue": "darkblue",
  "DarkGreen": "darkgreen",
  "DarkYellow": "darkyellow",
};

const useStyles = (value: string, checked: boolean) => {
  if (value) {
    return clx(
      "h-8 w-8 block",
      "border border-base-300 rounded-full",
      "ring-2 ring-offset-2",
      checked ? "ring-primary" : "ring-transparent",
    );
  }

  return clx(
    "btn btn-ghost",
    checked && "btn-outline",
  );
};

export const Ring = (
  { colorUrl, value, checked = false, class: _class }: {
    colorUrl?: string;
    value?: string;
    checked?: boolean;
    class?: string;
  },
) => {
  let color, styles;

  if (value) {
    color = colors[value];
    styles = clx(useStyles(value, checked), _class);
  }

  if (colorUrl) {
    styles = clx(useStyles(colorUrl, checked), _class);
  }

  return (
    <span
      style={{ backgroundColor: color || "", background: `url(${colorUrl})` }}
      class={styles}
    >
      {color ? null : value}
    </span>
  );
};

function VariantSelector({ product }: Props) {
  const { url, isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const variants = hasVariant;
  const relativeUrl = relative(url);
  const id = useId();

  return (
    <ul class="flex items-center justify-start gap-2 pt-4 pb-1 pl-1">
      {variants.map((variant) => (
        <li>
          <a href={variant.url} class="cursor-pointer">
            <input
              class="hidden peer"
              type="radio"
              name={`${id}-${variant.additionalProperty?.[0].value}`}
              checked={variant.url === relativeUrl}
            />
            <Ring
              colorUrl={variant.additionalProperty?.[0].value}
              checked={variant.url === relativeUrl}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default VariantSelector;
