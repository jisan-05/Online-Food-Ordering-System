import {
  CustomerReviews,
  FAQSection,
  FeaturedRestaurants,
  FoodCategories,
  HeroBanner,
  NewsletterSection,
  PopularFoods,
  SpecialOffers,
} from '../components/home/HomeSections'

function HomePage() {
  return (
    <>
      <HeroBanner />
      <FoodCategories />
      <PopularFoods />
      <FeaturedRestaurants />
      <SpecialOffers />
      <CustomerReviews />
      <FAQSection />
      <NewsletterSection />
    </>
  )
}

export default HomePage
