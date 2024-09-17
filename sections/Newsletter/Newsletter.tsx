import { AppContext } from "../../apps/site.ts";
import Icon from "../../components/ui/Icon.tsx";
import Section from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { useComponent } from "../Component.tsx";
import { type SectionProps as SectionProps } from "@deco/deco";
interface NoticeProps {
  title?: string;
  description?: string;
}
interface LinksProps {
  title?: string;
  links?: {
    label: string;
    href: string;
  }[];
}
export interface Props {
  content?: LinksProps;
  empty?: NoticeProps;
  success?: NoticeProps;
  failed?: NoticeProps;
  /** @description Signup label */
  label?: string;
  /** @description Input placeholder */
  placeholder?: string;
  /** @hide true */
  status?: "success" | "failed";
}
export async function action(props: Props, req: Request, ctx: AppContext) {
  const platform = usePlatform();
  const form = await req.formData();
  const email = `${form.get("email") ?? ""}`;
  if (platform === "vtex") {
    // deno-lint-ignore no-explicit-any
    await (ctx as any).invoke("vtex/actions/newsletter/subscribe.ts", {
      email,
    });
    return { ...props, status: "success" };
  }
  return { ...props, status: "failed" };
}
export function loader(props: Props) {
  return { ...props, status: undefined };
}
function Notice({ title, description }: NoticeProps) {
  return (
    <div class="flex flex-col justify-center items-center sm:items-start gap-6 mb-3">
      <span class="text-2xl font-bold">
        {title}
      </span>
      <span class="text-md font-normal text-base-300">
        {description}
      </span>
    </div>
  );
}
function Links({ title, links }: LinksProps) {
  return (
    <div class="flex flex-col justify-center items-center sm:items-start gap-6">
      <span class="text-2xl font-bold">
        {title}
      </span>
      <div class="flex flex-wrap">
        {links && links.map(({ href, label }) => {
          return (
            <a
              href={href}
              class="w-full sm:w-1/2 text-md font-normal text-base-300 px-4 pb-6"
            >
              {label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
function Newsletter({
  empty = {
    title: "Get top deals, latest trends, and more.",
    description:
      "Receive our news and promotions in advance. Enjoy and get 10% off your first purchase. For more information click here.",
  },
  success = {
    title: "Thank you for subscribing!",
    description:
      "You’re now signed up to receive the latest news, trends, and exclusive promotions directly to your inbox. Stay tuned!",
  },
  failed = {
    title: "Oops. Something went wrong!",
    description:
      "Something went wrong. Please try again. If the problem persists, please contact us.",
  },
  content = {
    title: "Get the most from your Frigidaire",
    links: [
      { href: "#", label: "Product Registration" },
      { href: "#", label: "Extended Service Warranties" },
      { href: "#", label: "Special Offers" },
      { href: "#", label: "Inspiration" },
    ],
  },
  label = "Sign up",
  placeholder = "Enter your email address",
  status,
}: SectionProps<typeof loader, typeof action>) {
  if (status === "success" || status === "failed") {
    return (
      <Section.Container full class="bg-base-200">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10">
          <Icon
            size={80}
            class={clx(status === "success" ? "text-success" : "text-error")}
            id={status === "success" ? "check-circle" : "error"}
          />
          <Notice {...status === "success" ? success : failed} />
        </div>
      </Section.Container>
    );
  }
  return (
    <Section.Container full class="bg-base-200">
      <div class="p-5 sm:p-12 grid grid-flow-row sm:grid-cols-2 gap-10 sm:gap-20 place-items-center items-start">
        <div>
          <Notice {...empty} />

          <form
            hx-target="closest section"
            hx-swap="outerHTML"
            hx-post={useComponent(import.meta.url)}
            class="flex flex-col sm:flex-row gap-4 w-full"
          >
            <input
              name="email"
              class="input input-bordered flex-grow rounded-none"
              type="text"
              placeholder={placeholder}
            />

            <button
              class="btn btn-primary text-xl w-full sm:w-40 font-normal"
              type="submit"
            >
              <span class="[.htmx-request_&]:hidden inline">
                {label}
              </span>
              <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
            </button>
          </form>
        </div>
        <div>
          <Links {...content} />
        </div>
      </div>
    </Section.Container>
  );
}
export default Newsletter;
