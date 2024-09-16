import { type HTMLWidget, type ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { clx } from "../../sdk/clx.ts";

export interface Props {
  title: string;
  description?: HTMLWidget;

  images: {
    mobile: ImageWidget;
    desktop: ImageWidget;
  };

  button?: {
    href: string;
    label: string;
  };
  imageLast?: boolean;
}

function Banner({ title, description, images, button, imageLast }: Props) {
  return (
    <div class="flex flex-col gap-4 sm:gap-6 w-full py-5 sm:py-10">
      <div class="flex flex-col sm:flex-row">
        <Picture
          class={clx(
            "sm:w-1/2 max-h-80 sm:max-h-none",
            imageLast ? "sm:order-last" : "sm:order-first",
          )}
        >
          <Source
            media="(max-width: 640px)"
            src={images.mobile}
            width={335}
            height={320}
          />
          <Source
            media="(min-width: 640px)"
            src={images.desktop}
            width={1320}
            height={480}
          />
          <img
            src={images.desktop}
            alt={title}
            class="max-h-80 sm:max-h-none sm:h-auto sm:w-full object-contain"
          />
        </Picture>

        <div
          class={clx(
            "p-5 sm:p-12",
            "box-border flex flex-col sm:w-1/2 gap-4",
          )}
        >
          {title && <span class="font-bold text-4xl">{title}</span>}
          {description && (
            <span
              class="font-normal text-xl"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          <span class="flex-grow" />
          <div>
            {button && (
              <a
                href={button.href}
                class="btn btn-primary no-animation text-xl w-full sm:w-fit"
              >
                {button.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
