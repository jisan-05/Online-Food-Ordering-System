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
import LiveOffersBar from '../components/home/LiveOffersBar'

function HomePage() {
  return (
    <>
      <LiveOffersBar />
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
