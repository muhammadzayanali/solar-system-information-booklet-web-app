import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header";

const CometPage = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [comets, setComets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editComet, setEditComet] = useState(null);
  const [newComet, setNewComet] = useState({
    name: "",
    distance_from_sun: "",
    orbital_period: "",
    last_observed: "",
    details: "",
    image_url: ""
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

        // Fetch comets
        const cometsResponse = await axios.get("http://localhost:5000/comets");
        setComets(cometsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddComet = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/comets",
        newComet,
        { withCredentials: true }
      );
      setComets([...comets, { ...newComet, id: response.data.id }]);
      setNewComet({
        name: "",
        distance_from_sun: "",
        orbital_period: "",
        last_observed: "",
        details: "",
        image_url: ""
      });
      setEditMode(false);
    } catch (err) {
      setError("Failed to add comet: " + (err.response?.data?.error || err.message));
    }
  };

  const handleUpdateComet = async () => {
    if (!editComet?.id) {
      setError("No comet selected for update");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/comets/${editComet.id}`,
        editComet,
        { withCredentials: true }
      );
      setComets(comets.map(c => 
        c.id === editComet.id ? editComet : c
      ));
      setEditComet(null);
      setEditMode(false);
    } catch (err) {
      setError("Failed to update comet: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteComet = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/comets/${id}`, {
        withCredentials: true,
      });
      setComets(comets.filter(comet => comet.id !== id));
    } catch (err) {
      setError("Failed to delete comet: " + (err.response?.data?.error || err.message));
    }
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const resetFormStates = () => {
    setEditMode(false);
    setEditComet(null);
    setNewComet({
      name: "",
      distance_from_sun: "",
      orbital_period: "",
      last_observed: "",
      details: "",
      image_url: ""
    });
  };

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen text-white">
        <Header />
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold">Comets Page</h1>
          <p className="text-lg mt-2">Loading comets data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 min-h-screen text-white">
        <Header />
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold">Comets Page</h1>
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
        <h1 className="text-4xl font-bold">Comets Page</h1>
        <p className="text-lg mt-2">Explore comets in our solar system</p>

        {user?.role === "admin" && (
          <div className="mt-4">
            {(!editMode && !editComet) ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                Add New Comet
              </button>
            ) : (
              <div className="max-w-md mx-auto bg-gray-800 p-4 rounded-lg mt-4">
                <h3 className="text-xl mb-4">
                  {editComet ? "Edit Comet" : "Add New Comet"}
                </h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={editComet?.name || newComet.name}
                    onChange={(e) =>
                      editComet
                        ? setEditComet({ ...editComet, name: e.target.value })
                        : setNewComet({ ...newComet, name: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Distance from Sun"
                    value={editComet?.distance_from_sun || newComet.distance_from_sun}
                    onChange={(e) =>
                      editComet
                        ? setEditComet({ ...editComet, distance_from_sun: e.target.value })
                        : setNewComet({ ...newComet, distance_from_sun: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Orbital Period"
                    value={editComet?.orbital_period || newComet.orbital_period}
                    onChange={(e) =>
                      editComet
                        ? setEditComet({ ...editComet, orbital_period: e.target.value })
                        : setNewComet({ ...newComet, orbital_period: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Observed (Year)"
                    value={editComet?.last_observed || newComet.last_observed}
                    onChange={(e) =>
                      editComet
                        ? setEditComet({ ...editComet, last_observed: e.target.value })
                        : setNewComet({ ...newComet, last_observed: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={editComet?.image_url || newComet.image_url}
                    onChange={(e) =>
                      editComet
                        ? setEditComet({ ...editComet, image_url: e.target.value })
                        : setNewComet({ ...newComet, image_url: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                  />
                  <textarea
                    placeholder="Details"
                    value={editComet?.details || newComet.details}
                    onChange={(e) =>
                      editComet
                        ? setEditComet({ ...editComet, details: e.target.value })
                        : setNewComet({ ...newComet, details: e.target.value })
                    }
                    className="w-full p-2 rounded bg-gray-700"
                    rows="3"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() =>
                        editComet ? handleUpdateComet() : handleAddComet()
                      }
                      className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                      disabled={!editComet?.name && !newComet.name}
                    >
                      {editComet ? "Update" : "Save"}
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
        {comets.map((comet, index) => (
          <div key={comet.id || index} className="w-full max-w-2xl relative">
            {user?.role === "admin" && (
              <div className="absolute right-2 top-2">
                <div className="flex flex-col space-y-1 bg-gray-800 p-2 rounded-md">
                  <button
                    onClick={() => {
                      setEditComet(comet);
                      setEditMode(true);
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${comet.name}?`)) {
                        handleDeleteComet(comet.id);
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
              <span className="text-xl font-semibold">{comet.name}</span>
              <span className="text-sm pr-14">
                Distance from Sun: {comet.distance_from_sun}
              </span>
            </button>
            {openDropdown === index && (
              <div className="mt-2 bg-gray-800 p-4 rounded-lg">
                <div className="space-y-4">
                  {/* {comet.image_url && (
                    <img 
                      src={comet.image_url} 
                      alt={comet.name} 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )} */}
                  <p className="text-lg">{comet.details}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Orbital Period</p>
                      <p>{comet.orbital_period}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Last Observed</p>
                      <p>{comet.last_observed}</p>
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

export default CometPage;