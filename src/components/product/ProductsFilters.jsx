"use client";

import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import SelectField from "../ui/SelectField";
import TextField from "../ui/TextField";
import Button from "../ui/Button";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";
import { PRODUCT_SORT_OPTIONS } from "../../utils/productParams";
import { cn } from "../../utils/cn";

export default function ProductsFilters({ filters, onApply, onClear }) {
  const [draft, setDraft] = useState(filters);
  const [open, setOpen] = useState(false);
  const { data: categories } = useCategories({ limit: 40 });
  const { data: brands } = useBrands({ limit: 40, page: 1 });

  useEffect(() => setDraft(filters), [filters]);

  function patch(values) {
    setDraft((current) => ({ ...current, ...values }));
  }

  function apply(event) {
    event.preventDefault();
    onApply({ ...draft, page: 1 });
    setOpen(false);
  }

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <button
        type="button"
        className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink lg:hidden"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Filter className="size-4" aria-hidden />
        Filters &amp; sort
      </button>

      <form
        onSubmit={apply}
        className={cn(
          "space-y-4 rounded-2xl border border-line bg-white p-4 shadow-card",
          open ? "block" : "hidden lg:block",
        )}
      >
        <TextField
          id="filter-keyword"
          label="Keyword"
          value={draft.keyword}
          onChange={(event) => patch({ keyword: event.target.value })}
        />
        <SelectField
          id="filter-sort"
          label="Sort by"
          value={draft.sort}
          onChange={(event) => patch({ sort: event.target.value })}
        >
          {PRODUCT_SORT_OPTIONS.map((option) => (
            <option key={option.value || "default"} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
        <SelectField
          id="filter-category"
          label="Category"
          value={draft.category}
          onChange={(event) => patch({ category: event.target.value })}
        >
          <option value="">All categories</option>
          {(categories?.items ?? []).map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </SelectField>
        <SelectField
          id="filter-brand"
          label="Brand"
          value={draft.brand}
          onChange={(event) => patch({ brand: event.target.value })}
        >
          <option value="">All brands</option>
          {(brands?.items ?? []).map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </SelectField>
        <div className="grid grid-cols-2 gap-3">
          <TextField
            id="filter-min"
            label="Min price"
            type="number"
            min="0"
            inputMode="numeric"
            value={draft.priceMin}
            onChange={(event) => patch({ priceMin: event.target.value })}
          />
          <TextField
            id="filter-max"
            label="Max price"
            type="number"
            min="0"
            inputMode="numeric"
            value={draft.priceMax}
            onChange={(event) => patch({ priceMax: event.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Button type="submit" className="w-full">
            Apply filters
          </Button>
          <Button type="button" variant="secondary" className="w-full" onClick={onClear}>
            Clear all
          </Button>
        </div>
      </form>
    </div>
  );
}