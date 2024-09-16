import { ProductDetailsPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import ProductImageZoom from "./ProductImageZoom.tsx";
import Icon from "../ui/Icon.tsx";
import Slider from "../ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

/**
 * @title Product Image Slider
 * @description Creates a three columned grid on destkop, one for the dots preview, one for the image slider and the other for product info
 * On mobile, there's one single column with 3 rows. Note that the orders are different from desktop to mobile, that's why
 * we rearrange each cell with col-start- directives
 */
export default function GallerySlider(props: Props) {
  const id = useId();
  const zoomId = `${id}-zoom`;

  if (!props.page) {
    throw new Error("Missing Product Details Page Info");
  }

  const {
    page: { product: { image: images = [] } },
  } = props;

  return (
    <>
      <div id={id} class="flex flex-col sm:flex-row-reverse gap-5">
        {/* Image Slider */}
        <div class="relative h-min flex-1">
          <Slider class="carousel carousel-center gap-6 w-full">
            {images.map((img, index) => (
              <Slider.Item
                index={index}
                class="carousel-item w-full"
              >
                <Image
                  class="w-full h-[600px]"
                  style={{ objectFit: "contain" }}
                  src={img.url!}
                  alt={img.alternateName}
                  fit="contain"
                  // Preload LCP image for better web vitals
                  preload={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </Slider.Item>
            ))}
          </Slider>

          <Slider.PrevButton
            class="no-animation absolute left-2 top-1/2 btn btn-circle btn-outline disabled:hidden"
            disabled
          >
            <Icon id="chevron-right" class="rotate-180" />
          </Slider.PrevButton>

          <Slider.NextButton
            class="no-animation absolute right-2 top-1/2 btn btn-circle btn-outline disabled:hidden"
            disabled={images.length < 2}
          >
            <Icon id="chevron-right" />
          </Slider.NextButton>

          <div class="absolute top-2 right-2 bg-base-100 rounded-full">
            <label class="btn btn-ghost hidden sm:inline-flex" for={zoomId}>
              <Icon id="pan_zoom" />
            </label>
          </div>
        </div>

        {/* Dots */}
        <ul
          class={clx(
            "carousel carousel-center",
            "sm:carousel-vertical",
            "gap-1 px-4",
            "sm:gap-2 sm:px-0",
          )}
          style={{ maxHeight: "600px" }}
        >
          {images.map((img, index) => (
            <li class="carousel-item">
              <Slider.Dot index={index}>
                <img
                  style={{ aspectRatio: "1 / 1" }}
                  class="group-disabled:border-base-400 border rounded object-contain w-16 h-16"
                  width={64}
                  height={64}
                  src={img.url!}
                  alt={img.alternateName}
                />
              </Slider.Dot>
            </li>
          ))}
        </ul>

        <Slider.JS rootId={id} />
      </div>
      <ProductImageZoom
        id={zoomId}
        images={images}
        width={700}
        height={700}
      />
    </>
  );
}
