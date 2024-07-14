import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useDevice } from "deco/hooks/useDevice.ts";
import Section, {
  type Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";

/** @titleBy label */
export interface Item {
  image: ImageWidget;
  href: string;
  label: string;
}

export interface Props extends SectionHeaderProps {
  items: Item[];
}

function Card({ image, href, label }: Item) {
  return (
    <a href={href} class="flex flex-col items-center justify-center gap-6">
      <div class="w-32 h-32 sm:w-72 sm:h-72 flex justify-center items-center">
        <Image
          src={image}
          alt={label}
          width={300}
          height={300}
          loading="lazy"
        />
      </div>
      <span class="font-medium text-2xl">{label}</span>
    </a>
  );
}

function CategoryGrid({ title, cta, items }: Props) {
  const device = useDevice();

  return (
    <Section.Container>
      <Section.Header title={title} cta={cta} />

      {device === "desktop"
        ? (
          <div class="grid grid-cols-3 gap-10">
            {items.map((i) => <Card {...i} />)}
          </div>
        )
        : (
          <Slider class="carousel carousel-center sm:carousel-end gap-6 w-full">
            {items.map((i, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "carousel-item",
                  "first:pl-5 first:sm:pl-0",
                  "last:pr-5 last:sm:pr-0",
                )}
              >
                <Card {...i} />
              </Slider.Item>
            ))}
          </Slider>
        )}
    </Section.Container>
  );
}

export default CategoryGrid;
