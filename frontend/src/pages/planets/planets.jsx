import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header";

const PlanetsPage = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editPlanet, setEditPlanet] = useState(null);
  const [newPlanet, setNewPlanet] = useState({
    name: "",
    distance_from_sun: "",
    diameter: "",
    orbital_period: "",
    details: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check auth and get user role
        const authResponse = await axios.get(
          "http://localhost:5000/check-auth",
          {
            withCredentials: true,
          }
        );

        if (authResponse.data.authenticated) {
          setUser(authResponse.data.user);
          localStorage.setItem("user", JSON.stringify(authResponse.data.user));
        }

        // Fetch planets
        const planetsResponse = await axios.get(
          "http://localhost:5000/planets"
        );
        setPlanets(planetsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddPlanet = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/planets",
        newPlanet,
        { withCredentials: true }
      );
      setPlanets([...planets, { ...newPlanet, id: response.data.id }]);
      setNewPlanet({
        name: "",
        distance_from_sun: "",
        diameter: "",
        orbital_period: "",
        details: "",
      });
      setEditMode(false);
    } catch (err) {
      setError("Failed to add planet: " + err.response?.data?.error);
    }
  };

  const handleUpdatePlanet = async () => {
    try {
      await axios.put(
        `http://localhost:5000/planets/${editPlanet.id}`,
        editPlanet,
        { withCredentials: true }
      );
      setPlanets(planets.map((p) => (p.id === editPlanet.id ? editPlanet : p)));
      setEditPlanet(null);
    } catch (err) {
      setError("Failed to update planet: " + err.response?.data?.error);
    }
  };

  const handleDeletePlanet = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/planets/${id}`, {
        withCredentials: true,
      });
      setPlanets(planets.filter((planet) => planet.id !== id));
    } catch (err) {
      setError("Failed to delete planet: " + err.response?.data?.error);
    }
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen text-white">
        <Header />
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold">Planets Page</h1>
          <p className="text-lg mt-2">Loading planets data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 min-h-screen text-white">
        <Header />
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold">Planets Page</h1>
          <p className="text-lg mt-2 text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <Header />
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold">Planets Page</h1>
        <p className="text-lg mt-2">Explore our solar system</p>

        {user?.role === "admin" && (
          <div className="mt-4">
            {!editMode && !editPlanet ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                Add New Planet
              </button>
            ) : (
              <div className="max-w-md mx-auto bg-gray-800 p-4 rounded-lg mt-4">
                <h3 className="text-xl mb-4">
                  {editPlanet ? "Edit Planet" : "Add New Planet"}
                </h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={editPlanet?.name || newPlanet.name}
                    onChange={(e) =>
                      editPlanet
                        ? setEditPlanet({ ...editPlanet, name: e.target.value })
                        : setNewPlanet({ ...newPlanet, name: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                  />
                  <input
                    type="text"
                    placeholder="Distance from Sun"
                    value={
                      editPlanet?.distance_from_sun ||
                      newPlanet.distance_from_sun
                    }
                    onChange={(e) =>
                      editPlanet
                        ? setEditPlanet({
                            ...editPlanet,
                            distance_from_sun: e.target.value,
                          })
                        : setNewPlanet({
                            ...newPlanet,
                            distance_from_sun: e.target.value,
                          })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                  />
                  <input
                    type="text"
                    placeholder="Diameter"
                    value={editPlanet?.diameter || newPlanet.diameter}
                    onChange={(e) =>
                      editPlanet
                        ? setEditPlanet({
                            ...editPlanet,
                            diameter: e.target.value,
                          })
                        : setNewPlanet({
                            ...newPlanet,
                            diameter: e.target.value,
                          })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                  />
                  <input
                    type="text"
                    placeholder="Orbital Period"
                    value={
                      editPlanet?.orbital_period || newPlanet.orbital_period
                    }
                    onChange={(e) =>
                      editPlanet
                        ? setEditPlanet({
                            ...editPlanet,
                            orbital_period: e.target.value,
                          })
                        : setNewPlanet({
                            ...newPlanet,
                            orbital_period: e.target.value,
                          })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                  />
                  <textarea
                    placeholder="Details"
                    value={editPlanet?.details || newPlanet.details}
                    onChange={(e) =>
                      editPlanet
                        ? setEditPlanet({
                            ...editPlanet,
                            details: e.target.value,
                          })
                        : setNewPlanet({
                            ...newPlanet,
                            details: e.target.value,
                          })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                    rows="3"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() =>
                        editPlanet ? handleUpdatePlanet() : handleAddPlanet()
                      }
                      className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                    >
                      {editPlanet ? "Update" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditPlanet(null);
                        setNewPlanet({
                          name: "",
                          distance_from_sun: "",
                          diameter: "",
                          orbital_period: "",
                          details: "",
                        });
                      }}
                      className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 p-4">
        {planets.map((planet, index) => (
          <div key={planet.id || index} className="w-full max-w-2xl relative">
            {user?.role === "admin" && (
              <div className="absolute right-2 top-2">
                <div className="flex flex-col space-y-1 bg-gray-800 p-2 rounded-md">
                  <button
                    onClick={() => setEditPlanet(planet)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePlanet(planet.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={() => toggleDropdown(index)}
              className="w-full bg-gray-700 p-7 rounded-lg text-left flex justify-between items-center hover:bg-gray-600 transition-colors"
            >
              <span className="text-xl font-semibold">{planet.name}</span>
              <span className="text-sm pr-10">{planet.distance_from_sun}</span>
            </button>
            {openDropdown === index && (
              <div className="mt-2 bg-gray-800 p-4 rounded-lg">
                <div className="space-y-4">
                  <p className="text-lg">{planet.details}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Diameter</p>
                      <p>{planet.diameter}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Orbital Period</p>
                      <p>{planet.orbital_period}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanetsPage;

// import React, { useState, useEffect } from "react";
// import Header from "../../components/header";

// const PlanetsPage = () => {
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [planets, setPlanets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPlanets = async () => {
//       try {
//         const response = await fetch("http://127.0.0.1:5000/planets");
//         if (!response.ok) {
//           throw new Error("Failed to fetch planets data");
//         }
//         const data = await response.json();
//         setPlanets(data);
//       } catch (err) {
//         setError(err.message);
//         // for testing purposes, we can set fallback data
//         setPlanets([
//           // {
//           //   name: "Mercury",
//           //   distance_from_sun: "57.91 million km",
//           //   diameter: "4,880 km",
//           //   orbital_period: "88 days",
//           //   details: "Mercury is the closest planet to the sun and also the smallest planet in the solar system."
//           // },
//           // {
//           //   name: "Venus",
//           //   distance_from_sun: "108.2 million km",
//           //   diameter: "12,104 km",
//           //   orbital_period: "225 days",
//           //   details: "Venus is the second planet from the Sun. It is a terrestrial planet and is the closest in mass and size to its orbital neighbour Earth."
//           // },
//           {name: "No data available"},
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlanets();
//   }, []);

//   const toggleDropdown = (index) => {
//     setOpenDropdown(openDropdown === index ? null : index);
//   };

//   if (loading) {
//     return (
//       <div className="bg-slate-900 min-h-screen text-white">
//         <Header />
//         <div className="text-center py-8">
//           <h1 className="text-4xl font-bold">Planets Page</h1>
//           <p className="text-lg mt-2">Loading planets data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-slate-900 min-h-screen text-white">
//         <Header />
//         <div className="text-center py-8">
//           <h1 className="text-4xl font-bold">Planets Page</h1>
//           <p className="text-lg mt-2 text-red-500">Error: {error}</p>
//           <p className="text-sm mt-2">Showing fallback data</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-slate-900 min-h-screen text-white">
//       <div>
//         <Header />
//       </div>

//       <div className="text-center py-8">
//         <h1 className="text-4xl font-bold">Planets Page</h1>
//         <p className="text-lg mt-2">Explore our solar system</p>
//       </div>

//       <div className="flex flex-col items-center justify-center space-y-4 p-4">
//         {planets.map((planet, index) => (
//           <div key={index} className="w-full max-w-2xl">
//             <button
//               onClick={() => toggleDropdown(index)}
//               className="w-full bg-gray-700 p-4 rounded-lg text-left flex justify-between items-center hover:bg-gray-600 transition-colors"
//             >
//               <span className="text-xl font-semibold">{planet.name}</span>
//               <span className="text-sm">{planet.distance_from_sun}</span>
//             </button>
//             {openDropdown === index && (
//               <div className="mt-2 bg-gray-800 p-4 rounded-lg">
//                 <div className="space-y-4">
//                   <p className="text-lg">{planet.details}</p>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="font-semibold">Diameter</p>
//                       <p>{planet.diameter}</p>
//                     </div>
//                     <div>
//                       <p className="font-semibold">Orbital Period</p>
//                       <p>{planet.orbital_period}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PlanetsPage;
