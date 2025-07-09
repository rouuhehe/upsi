interface CharacteristicsProps {
  name: string;
  icon: string;
}

export default function Characteristics(props: CharacteristicsProps) {
  return (
    <div className="flex flex-col items-center gap-2 opacity-0 translate-y-4 fade-in-up">
      <div className="w-20 h-20 rounded-full border-2 border-white overflow-hidden">
        <img
          src={props.icon}
          alt={props.name}
          className="w-full h-full object-cover filter brightness-110"
        />
      </div>
      <p className="text-black text-center mt-2">{props.name}</p>
    </div>
  );
}
