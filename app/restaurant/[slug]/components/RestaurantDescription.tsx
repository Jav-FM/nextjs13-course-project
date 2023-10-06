const RestaurantDescription = ({ description }: { description: string }) => {
  return (
    <div className="mt-4">
      <p className="text-tl font-light">{description}</p>
    </div>
  );
};

export default RestaurantDescription;
