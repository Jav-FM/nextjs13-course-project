import Link from "next/link";
import Price from "../../components/Price";
import { Cuisine, PRICE, Location, Review } from "@prisma/client";
import { calculateReviewRatingAverage } from "../../../utils/calculateReviewRatingAverage";
import Stars from "../../components/Stars";

interface RestaurantSearchCardType {
  id: number;
  name: string;
  main_image: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
  slug: string;
  reviews: Review[];
}

const SearchRestaurantCard = ({
  restaurant,
}: {
  restaurant: RestaurantSearchCardType;
}) => {
  const raiting = calculateReviewRatingAverage(restaurant.reviews);
  const renderRatingText = () => {
    if (raiting > 4) return "Awesome";
    else if (raiting <= 4 && raiting > 3) return "Good";
    else if (raiting <= 3 && raiting > 0) return "Average";
    else "";
  };

  return (
    <div className="border-b flex pb-5 ml-4">
      <img src={restaurant.main_image} alt="" className="w-44 rounded" />
      <div className="pl-5">
        <h2 className="text-3xl">{restaurant.name}</h2>
        <div className="flex items-start">
          <div className="flex mb-2">
            <Stars reviews={restaurant.reviews} />
          </div>
          <p className="ml-2 text-sm">{renderRatingText()}</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex flex-reg">
            <Price price={restaurant.price} />
            <p className="mr-4 capitalize">{restaurant.cuisine.name}</p>
            <p className="mr-4 capitalize">{restaurant.location.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`/restaurant/${restaurant.slug}`}>
            View more information
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchRestaurantCard;
