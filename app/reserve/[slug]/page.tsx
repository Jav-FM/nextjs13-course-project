import ReserveHeader from "./components/ReserveHeader";
import ReservationForm from "./components/ReservationForm";

const RestaurantReservationPage = () => {
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <ReserveHeader />
        <ReservationForm />
      </div>
    </div>
  );
};

export default RestaurantReservationPage;
