import { List, ListItem } from "@mui/material";

import { SERVICE_CATEGORY_OPTIONS, t } from "@/config/messages.fa";
import { buildListingHref, parseListingFilters } from "@/lib/listing/filters";

import { CategoryLinkItem } from "./CategoryLinkItem";

const NAV_OPTIONS = SERVICE_CATEGORY_OPTIONS.filter((option) => option.value !== "other");

export function CategoryNav({ params }: { params: URLSearchParams }) {
  const activeCategory = parseListingFilters(params).category;

  return (
    <nav aria-label={t("home.categories")}>
      <List component="ul" disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {NAV_OPTIONS.map((option) => {
          const isActive = option.value === activeCategory;
          return (
            <ListItem key={option.value} component="li" disablePadding>
              <CategoryLinkItem
                href={buildListingHref(params, { category: isActive ? null : option.value })}
                label={option.label}
                selected={isActive}
              />
            </ListItem>
          );
        })}
      </List>
    </nav>
  );
}
