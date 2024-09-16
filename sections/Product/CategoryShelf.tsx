import Section, {
  Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import Slider from "../../components/ui/Slider.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { clx } from "../../sdk/clx.ts";
import { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";

export interface Category {
  images: {
    mobile: ImageWidget;
    desktop: ImageWidget;
  };
  title: string;
  url: string;
}

export interface Props extends SectionHeaderProps {
  categories: Category[];
}

const WIDTH = 320;
const HEIGHT = 320;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

export default function ProductShelf({ categories, title }: Props) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <Section.Container class="[view-transition-name:loading-fallback-2]">
      <div
        class={clx(
          "flex justify-between items-center gap-2",
          "px-5 sm:px-0",
        )}
      >
        <span class="text-3xl sm:text-5xl font-semibold">{title}</span>
      </div>

      <div
        id="category-shelf"
        class="grid grid-rows-1"
        style={{
          gridTemplateColumns: "min-content 1fr min-content",
        }}
      >
        <div class="col-start-1 col-span-3 row-start-1 row-span-1">
          <Slider class="carousel carousel-center sm:carousel-end gap-5 sm:gap-10 w-full">
            {categories?.map(({ images, title, url }, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "carousel-item",
                  "first:pl-5 first:sm:pl-0",
                  "last:pr-5 last:sm:pr-0",
                )}
              >
                <a
                  href={url}
                  aria-label="view product"
                  class={clx(
                    "grid grid-cols-1 grid-rows-1 max-w-80",
                  )}
                >
                  <div class="card card-compact rounded-none group text-2xl border-none p-2 items-center">
                    <figure
                      style={{ aspectRatio: ASPECT_RATIO }}
                    >
                      <Picture class="h-full w-full">
                        <Source
                          media="(max-width: 640px)"
                          src={images.mobile}
                          width={WIDTH}
                          height={HEIGHT}
                        />
                        <Source
                          media="(min-width: 640px)"
                          src={images.desktop}
                          width={WIDTH}
                          height={HEIGHT}
                        />
                        <img
                          src={images.desktop}
                          alt={title}
                          class="object-cover"
                        />
                      </Picture>
                    </figure>
                    <span class="my-4">{title}</span>
                  </div>
                </a>
              </Slider.Item>
            ))}
          </Slider>
        </div>

        <div class="col-start-1 col-span-1 row-start-1 row-span-1 z-10 self-center">
          <Slider.PrevButton class="hidden sm:flex disabled:hidden btn btn-neutral btn-sm btn-circle no-animation">
            <Icon id="chevron-right" class="rotate-180" />
          </Slider.PrevButton>
        </div>

        <div class="col-start-3 col-span-1 row-start-1 row-span-1 z-10 self-center">
          <Slider.NextButton class="hidden sm:flex btn btn-neutral btn-sm btn-circle no-animation">
            <Icon id="chevron-right" />
          </Slider.NextButton>
        </div>
      </div>
      <Slider.JS rootId="category-shelf" />
    </Section.Container>
  );
}

export function LoadingFallback() {
  return (
    <div
      style={{ height: "716px" }}
      class="flex justify-center items-center [view-transition-name:loading-fallback-2]"
    >
      <span class="loading loading-spinner" />
    </div>
  );
}
