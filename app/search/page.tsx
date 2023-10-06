import { PrismaClient, PRICE } from "@prisma/client";
import SearchHeader from "./components/SearchHeader";
import SearchRestaurantCard from "./components/SearchRestaurantCard";
import SearchSideBar from "./components/SearchSideBar";

interface SearchParamsType {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

const prisma = new PrismaClient();
const fetchRestaurantsByQueries = (searchParams: SearchParamsType) => {
  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
    reviews: true,
  };

  const where: any = {};
  if (searchParams.city) {
    const location = { name: searchParams.city.toLowerCase() };
    where.location = location;
  }

  if (searchParams.cuisine) {
    const cuisine = { name: searchParams.cuisine.toLowerCase() };
    where.cuisine = cuisine;
  }

  if (searchParams.price) {
    const price = searchParams.price;
    where.price = price;
  }

  const restaurant = prisma.restaurant.findMany({
    where,
    select,
  });

  if (!restaurant) {
    throw new Error();
  }

  return restaurant;
};

const fetchLocations = () => {
  const locations = prisma.location.findMany();
  if (!locations) {
    throw new Error();
  }
  return locations;
};

const fetchCuisines = () => {
  const cuisines = prisma.cuisine.findMany();
  if (!cuisines) {
    throw new Error();
  }
  return cuisines;
};

const SearchPage = async ({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) => {
  const restaurants = await fetchRestaurantsByQueries(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();

  return (
    <>
      <SearchHeader />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          locations={locations}
          cuisines={cuisines}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length ? (
            <>
              {restaurants.map((restaurant) => (
                <SearchRestaurantCard restaurant={restaurant} />
              ))}
            </>
          ) : (
            <p>There are no restaurants for this area</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
