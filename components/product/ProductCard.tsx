import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { Ring } from "./ProductVariantSelector.tsx";
import { useId } from "../../sdk/useId.ts";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description used for analytics event */
  itemListName?: string;

  /** @description index of the product card in the list */
  index?: number;

  class?: string;
}

const WIDTH = 287;
const HEIGHT = 287;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  class: _class,
}: Props) {
  const id = useId();

  const { image: images, offers, isVariantOf, additionalProperty: baseProps } =
    product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const title = isVariantOf?.name ?? product.name;
  const [plpImage] = images ?? [];

  const { listPrice, price, availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const variants = hasVariant;

  const relativeUrl = relative(variants[0].url);

  const dimensions: string[] = [];
  const bullets: string[] = [];
  const badges: [string | undefined, string | undefined][] = [];

  variants[0].additionalProperty?.forEach((prop) => {
    if (
      prop.propertyID && prop.value
    ) {
      if (["depth", "height", "width"].includes(prop.propertyID)) {
        dimensions.push(prop.value);
      }

      if (prop.propertyID === "badge") {
        badges.push([prop.value, prop.valueReference]);
      }
    }
  });

  if (baseProps) {
    baseProps.forEach((prop) => {
      if (prop.value && prop.propertyID === "bullet") {
        bullets.push(prop.value);
      }
    });
  }

  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });

  {/* Add click event to dataLayer */}
  const event = useSendEvent({
    on: "click",
    event: {
      name: "select_item" as const,
      params: {
        item_list_name: itemListName,
        items: [item],
      },
    },
  });

  return (
    <div
      {...event}
      class={clx(
        "card card-compact rounded-none group text-sm border border-neutral-300 p-5",
        _class,
      )}
    >
      <figure
        class={clx(
          "relative",
          "rounded border border-transparent",
        )}
        style={{ aspectRatio: ASPECT_RATIO }}
      >
        {/* Product Images */}
        <a
          href={relativeUrl}
          aria-label="view product"
          class={clx(
            "absolute top-0 left-0",
            "grid grid-cols-1 grid-rows-1",
            "w-full",
            !inStock && "opacity-70",
          )}
        >
          <img
            data-fresh-disable-lock={true}
            src={plpImage.url!}
            alt={plpImage.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-contain",
              "rounded w-full",
              "col-span-full row-span-full",
            )}
            sizes="(max-width: 640px) 50vw, 20vw"
            loading={preload ? "eager" : "lazy"}
            decoding="async"
          />
        </a>

        {/* Wishlist button */}
        <div class="absolute top-0 left-0 w-full flex items-center justify-between">
          {/* Discounts */}
          <span
            class={clx(
              "text-sm/4 font-normal text-black bg-primary bg-opacity-15 text-center rounded-badge px-2 py-1",
              (percent < 1 || !inStock) && "opacity-0",
            )}
          >
            {percent} % off
          </span>
        </div>
      </figure>

      {/* SKU Selector */}
      <ul class="flex flex-grow min-h-4 items-center justify-start gap-2 mb-2 ml-1 my-6">
        {variants.length > 1 && variants.map((variant) => (
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

      <a href={relativeUrl}>
        <span class="font-bold text-base">
          {title}
        </span>
      </a>

      {dimensions.length > 0 && (
        <div class="mt-2">
          <ul class="flex font-xs">
            <li class="mr-2">
              H: <span class="font-bold">{dimensions[1]}</span>
            </li>
            <li class="mr-2">
              W: <span class="font-bold">{dimensions[2]}</span>
            </li>
            <li>
              D: <span class="font-bold">{dimensions[0]}</span>
            </li>
          </ul>
        </div>
      )}

      {badges.length > 0 && (
        <div class="my-4">
          <ul class="flex flex-col font-xs">
            {badges.map(([text, icon]) => (
              <li class="flex my-1">
                <img class="mr-4 w-5 h-5" src={icon} />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {bullets.length > 0 && (
        <div class="my-4">
          <ul class="flex flex-col font-xs">
            {bullets.map((text) => (
              <li class="flex my-1">
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div class="flex-grow" />

      {price && (
        <div class="flex gap-2 pt-2">
          <span class="text-xl font-medium text-secondary">
            {formatPrice(price, offers?.priceCurrency)}
          </span>
          {listPrice && (
            <span class="line-through font-normal text-base text-gray-400">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductCard;
