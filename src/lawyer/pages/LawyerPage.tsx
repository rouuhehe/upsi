import LawyerList from "../components/LawyerList";

export const LawyerPage = () => {
  return (
    <div className="px-4 md:px-8  space-y-6">
      <h1 className="text-2xl font-bold text-sky-700">Abogados disponibles</h1>

      <LawyerList />
    </div>
  );
};
