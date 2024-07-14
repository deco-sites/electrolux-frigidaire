import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { NAVBAR_HEIGHT_DESKTOP } from "../../constants.ts";

function NavItem({ item }: { item: SiteNavigationElement }) {
  const { url, name, children } = item;
  const image = item?.image?.[0];

  return (
    <li
      class="group flex items-center pr-5"
      style={{ height: NAVBAR_HEIGHT_DESKTOP }}
    >
      <a
        href={url}
        class="group-hover:underline text-base/5 font-medium"
      >
        {name}
      </a>

      {children && children.length > 0 &&
        (
          <div
            class="fixed hidden hover:flex group-hover:flex bg-base-100 z-40 items-start justify-center gap-6 border-t-2 border-b-2 border-base-200 absolute"
            style={{
              top: "0px",
              right: "0px",
              marginTop: NAVBAR_HEIGHT_DESKTOP,
            }}
          >
            {image?.url && (
              <Image
                class="p-6"
                src={image.url}
                alt={image.alternateName}
                width={300}
                height={332}
                loading="lazy"
              />
            )}
            <ul class="flex flex-col flex-wrap w-auto max-h-[400px] border border-solid border-neutral-300">
              {children.map((node) => (
                <li class="p-3">
                  <a class="hover:underline font-bold" href={node.url}>
                    <span>{node.name}</span>
                  </a>

                  {node.children &&
                    (
                      <ul class="flex flex-col gap-1 mt-2">
                        {node.children?.map((leaf) => (
                          <li>
                            <a class="hover:underline" href={leaf.url}>
                              <span class="text-s">{leaf.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
              ))}
            </ul>
          </div>
        )}
    </li>
  );
}

export default NavItem;
