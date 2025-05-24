import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header";

const AsteroidPage = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editAsteroid, setEditAsteroid] = useState(null);
  const [newAsteroid, setNewAsteroid] = useState({
    name: "",
    discovery_year: "",
    diameter: "",
    distance_from_sun: "",
    details: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check auth and get user role
        const authResponse = await axios.get(
          "http://localhost:5000/check-auth",
          { withCredentials: true }
        );

        if (authResponse.data.authenticated) {
          setUser(authResponse.data.user);
          localStorage.setItem("user", JSON.stringify(authResponse.data.user));
        }

        // Fetch asteroids
        const asteroidsResponse = await axios.get("http://localhost:5000/asteroids");
        setAsteroids(asteroidsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddAsteroid = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/asteroids",
        newAsteroid,
        { withCredentials: true }
      );
      setAsteroids([...asteroids, { ...newAsteroid, id: response.data.id }]);
      setNewAsteroid({
        name: "",
        discovery_year: "",
        diameter: "",
        distance_from_sun: "",
        details: ""
      });
      setEditMode(false);
    } catch (err) {
      setError("Failed to add asteroid: " + (err.response?.data?.error || err.message));
    }
  };

  const handleUpdateAsteroid = async () => {
    if (!editAsteroid?.id) {
      setError("No asteroid selected for update");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/asteroids/${editAsteroid.id}`,
        editAsteroid,
        { withCredentials: true }
      );
      setAsteroids(asteroids.map(a => 
        a.id === editAsteroid.id ? editAsteroid : a
      ));
      setEditAsteroid(null);
      setEditMode(false);
    } catch (err) {
      setError("Failed to update asteroid: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteAsteroid = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/asteroids/${id}`, {
        withCredentials: true,
      });
      setAsteroids(asteroids.filter(asteroid => asteroid.id !== id));
    } catch (err) {
      setError("Failed to delete asteroid: " + (err.response?.data?.error || err.message));
    }
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const resetFormStates = () => {
    setEditMode(false);
    setEditAsteroid(null);
    setNewAsteroid({
      name: "",
      discovery_year: "",
      diameter: "",
      distance_from_sun: "",
      details: ""
    });
  };

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen text-white">
        <Header />
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold">Asteroids Page</h1>
          <p className="text-lg mt-2">Loading asteroids data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 min-h-screen text-white">
        <Header />
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold">Asteroids Page</h1>
          <p className="text-lg mt-2 text-red-500">Error: {error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-4 bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <Header />
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold">Asteroids Page</h1>
        <p className="text-lg mt-2">Explore asteroids in our solar system</p>

        {user?.role === "admin" && (
          <div className="mt-4">
            {(!editMode && !editAsteroid) ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                Add New Asteroid
              </button>
            ) : (
              <div className="max-w-md mx-auto bg-gray-800 p-4 rounded-lg mt-4">
                <h3 className="text-xl mb-4">
                  {editAsteroid ? "Edit Asteroid" : "Add New Asteroid"}
                </h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={editAsteroid?.name || newAsteroid.name}
                    onChange={(e) =>
                      editAsteroid
                        ? setEditAsteroid({ ...editAsteroid, name: e.target.value })
                        : setNewAsteroid({ ...newAsteroid, name: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Discovery Date (YYYY-MM-DD)"
                    value={editAsteroid?.discovery_year || newAsteroid.discovery_year}
                    onChange={(e) =>
                      editAsteroid
                        ? setEditAsteroid({ ...editAsteroid, discovery_year: e.target.value })
                        : setNewAsteroid({ ...newAsteroid, discovery_year: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Diameter (km)"
                    value={editAsteroid?.diameter || newAsteroid.diameter}
                    onChange={(e) =>
                      editAsteroid
                        ? setEditAsteroid({ ...editAsteroid, diameter: e.target.value })
                        : setNewAsteroid({ ...newAsteroid, diameter: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Distance from Sun"
                    value={editAsteroid?.distance_from_sun || newAsteroid.distance_from_sun}
                    onChange={(e) =>
                      editAsteroid
                        ? setEditAsteroid({ ...editAsteroid, distance_from_sun: e.target.value })
                        : setNewAsteroid({ ...newAsteroid, distance_from_sun: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                    required
                  />
                  <textarea
                    placeholder="Details"
                    value={editAsteroid?.details || newAsteroid.details}
                    onChange={(e) =>
                      editAsteroid
                        ? setEditAsteroid({ ...editAsteroid, details: e.target.value })
                        : setNewAsteroid({ ...newAsteroid, details: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                    rows="3"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() =>
                        editAsteroid ? handleUpdateAsteroid() : handleAddAsteroid()
                      }
                      className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                      disabled={!editAsteroid?.name && !newAsteroid.name}
                    >
                      {editAsteroid ? "Update" : "Save"}
                    </button>
                    <button
                      onClick={resetFormStates}
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
        {asteroids.map((asteroid, index) => (
          <div key={asteroid.id || index} className="w-full max-w-2xl relative">
            {user?.role === "admin" && (
              <div className="absolute right-2 top-2">
                <div className="flex flex-col space-y-1 bg-gray-800 p-2 rounded-md">
                  <button
                    onClick={() => {
                      setEditAsteroid(asteroid);
                      setEditMode(true);
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${asteroid.name}?`)) {
                        handleDeleteAsteroid(asteroid.id);
                      }
                    }}
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
              <span className="text-xl font-semibold">{asteroid.name}</span>
              <span className="text-sm pr-14">
                Discovered: {asteroid.discovery_year}
              </span>
            </button>
            {openDropdown === index && (
              <div className="mt-2 bg-gray-800 p-4 rounded-lg">
                <div className="space-y-4">
                  <p className="text-lg">{asteroid.details}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Diameter</p>
                      <p>{asteroid.diameter} km</p>
                    </div>
                    <div>
                      <p className="font-semibold">Distance from Sun</p>
                      <p>{asteroid.distance_from_sun}</p>
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

export default AsteroidPage;