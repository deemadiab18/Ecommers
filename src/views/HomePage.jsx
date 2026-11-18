"use client";

import HeroSlider from "../components/home/HeroSlider";
import FeaturesStrip from "../components/home/FeaturesStrip";
import CategoryStrip from "../components/home/CategoryStrip";
import ProductShowcase from "../components/product/ProductShowcase";
import BrandsStrip from "../components/home/BrandsStrip";
import PromoBanners from "../components/home/PromoBanners";
import NewsletterBlock from "../components/home/NewsletterBlock";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <FeaturesStrip />
      <CategoryStrip />
      <ProductShowcase
        className="bg-white"
        title="New arrivals"
        subtitle="Recently added to the store."
        params={{ limit: 8, page: 1, sort: "-createdAt" }}
        viewAllTo="/products"
      />
      <PromoBanners />
      <ProductShowcase
        className="bg-surface"
        title="Top rated"
        subtitle="Loved by shoppers across Egypt."
        params={{ limit: 8, page: 1, sort: "-ratingsAverage" }}
        viewAllTo="/products?sort=-ratingsAverage"
      />
      <ProductShowcase
        className="bg-white"
        title="Best sellers"
        subtitle="Popular picks flying off the shelves."
        params={{ limit: 8, page: 1, sort: "-sold" }}
        viewAllTo="/products"
      />
      <BrandsStrip />
      <NewsletterBlock />
    </>
  );
}