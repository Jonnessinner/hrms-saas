type Props = {
  title: string
  value: string
  color: string
}

export default function StatCard({
  title,
  value,
  color,
}: Props) {
  return (
    <div
      className={`${color} text-white p-6 rounded-2xl shadow-lg`}
    >
      <h2 className="text-lg">
        {title}
      </h2>

      <p className="text-4xl font-bold mt-2">
        {value}
      </p>
    </div>
  )
}