function Navbar() {
  return (
    <div className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-bold text-slate-800">
        HRMS Dashboard
      </h1>

      <div className="flex items-center gap-4">

        <input
          type="text"
          placeholder="Search..."
          className="border px-4 py-2 rounded-xl outline-none"
        />

        <div className="w-10 h-10 bg-purple-600 text-white flex items-center justify-center rounded-full font-bold">
          A
        </div>

      </div>

    </div>
  )
}

export default Navbar