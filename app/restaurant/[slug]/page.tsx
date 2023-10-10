import RestaurantNavBar from "./components/RestaurantNavBar";
import RestaurantTitle from "./components/RestaurantTitle";
import RestaurantRaiting from "./components/RestaurantRaiting";
import RestaurantDescription from "./components/RestaurantDescription";
import RestaurantImages from "./components/RestaurantImages";
import RestaurantReviews from "./components/RestaurantReviews";
import ReservationCard from "./components/ReservationCard";
import { PrismaClient, Review } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

interface Restaurant {
  id: number;
  name: string;
  images: string[];
  description: string;
  slug: string;
  reviews: Review[];
  open_time: string;
  close_time: string;
}

const fetchRestaurantBySlug = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
      reviews: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    notFound();
  }
  return restaurant;
};

const RestaurantDetailsPage = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const restaurant = await fetchRestaurantBySlug(params.slug);
  const reviews = restaurant.reviews;

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <RestaurantTitle name={restaurant.name} />
        <RestaurantRaiting reviews={reviews} />
        <RestaurantDescription description={restaurant.description} />
        <RestaurantImages images={restaurant.images} />
        <RestaurantReviews reviews={reviews} />
      </div>
      <ReservationCard
        openTime={restaurant.open_time}
        closeTime={restaurant.close_time}
        slug={restaurant.slug}
      />
    </>
  );
};

export default RestaurantDetailsPage;
