import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, connectUser, logoutUser } from "../../slices/userSlice";
import { updateProfil, deleteOneUser } from "../../api/user";
import { useNavigate } from "react-router-dom";

const Profil = (props) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [msg, setMsg] = useState(null);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [adress, setAdress] = useState("");
  const [zip, setZip] = useState(""); // Initialisé à une chaîne vide
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const removeUser = (e) => {
    e.preventDefault();
    deleteOneUser(user.infos.id)
      .then((res) => {
        if (res.status === 200) {
          window.localStorage.removeItem("kaishi-token");
          dispatch(logoutUser());
          navigate("/login");
        } else {
          setMsg("Impossible de supprimer le compte.");
        }
      })
      .catch((err) => console.log(err));
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    setMsg(null);
    const datas = {
      firstname,
      lastname,
      adress,
      zip,
      city,
      phone,
    };
    // Envoi de la demande de modification vers le back
    updateProfil(datas, user.infos.id)
      .then((res) => {
        if (res.status !== 200) {
          setMsg("Une erreur est survenue lors de la modification");
        } else {
          // Mise à jour des informations d'utilisateur dans Redux
          const token = window.localStorage.getItem("kaishi-token");
          let newUser = res.newUser;
          newUser.token = token;
          dispatch(connectUser(newUser));
          setMsg("Votre profil a bien été modifié");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (user.infos) {
      setFirstName(user.infos.firstname ?? "");
      setLastName(user.infos.lastname ?? "");
      setAdress(user.infos.adress ?? "");
      setZip(user.infos.zip ?? ""); 
      setCity(user.infos.city ?? "");
      setPhone(user.infos.phone ?? "");
    }
  }, [user]);

  return (
    <section id="profil">
      <div className="profil-container">
        <h2>Profil</h2>
        {msg !== null && <p className="error-message">{msg}</p>}
        <form className="profil-form" onSubmit={onSubmitForm}>
          <div className="input-group">
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstName(e.currentTarget.value)}
              placeholder="First Name"
            />
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastName(e.currentTarget.value)}
              placeholder="Last Name"
            />
          </div>
          <input
            type="text"
            value={adress}
            onChange={(e) => setAdress(e.currentTarget.value)}
            placeholder="Address"
          />
          <div className="input-group">
            <input
              type="number"
              value={zip}
              onChange={(e) => setZip(e.currentTarget.value)}
              placeholder="Zip Code"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.currentTarget.value)}
              placeholder="City"
            />
          </div>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
            placeholder="Phone"
          />
          <input type="submit" value="Enregistrer" />
        </form>
        <button className="delete-button" onClick={removeUser}>
          Supprimer mon compte
        </button>
      </div>
    </section>
  );
};

export default Profil;
