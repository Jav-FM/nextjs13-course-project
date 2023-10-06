import { Review } from "@prisma/client";
import ReviewCard from "./ReviewCard";

const RestaurantReviews = ({ reviews }: { reviews: Review[] }) => {
  const reviewsNumber = reviews.length;
  const subjectAndNoun = reviewsNumber > 1 ? "people are" : "person is";

  return (
    <div>
      <h1 className="font-bold text-3xl mt-10 mb-7 border-b pb-5">
        What {reviewsNumber} {subjectAndNoun} saying
      </h1>
      <div>
        {reviews.length ? (
          <>
            {reviews.map((review) => (
              <ReviewCard review={review} key={review.id} />
            ))}
          </>
        ) : (
          <p>There are no reviews for now.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantReviews;
