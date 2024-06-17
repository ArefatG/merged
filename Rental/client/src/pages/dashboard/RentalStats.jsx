import React from "react";
import useRentalStats from "../../hooks/useRentalStats";

const RentalStats = () => {
  const [stats, refetch] = useRentalStats();

  // Sort the stats array by totalRented in descending order
  const sortedStats = [...stats].sort((a, b) => b.totalRented - a.totalRented);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Rental Statistics</h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Gear Name</th>
              <th>Total Rented</th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">
                  <div className="w-16 h-16">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                  </div>
                </td>
                <td className="p-4">{item.name}</td>
                <td className="p-4">{item.totalRented}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentalStats;
