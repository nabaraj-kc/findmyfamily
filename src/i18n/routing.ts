import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ne', 'en'],
  defaultLocale: 'ne',
  localePrefix: 'as-needed', 
});
import { createNavigation } from 'next-intl/navigation';

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
