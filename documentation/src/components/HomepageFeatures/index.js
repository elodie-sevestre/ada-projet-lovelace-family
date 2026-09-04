import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Architecture claire",
    img: "/img/sprout-flower.png",
    description: (
      <>
        Frontend React, backend Express organisé en couches, base de données
        PostgreSQL — le tout orchestré avec Docker Compose.
      </>
    ),
  },
  {
    title: "Pensé pour l'équipe",
    img: "/img/sprout-avatar.png",
    description: (
      <>
        Conventions de branches, de commits et de Pull Requests documentées pour
        collaborer efficacement à plusieurs.
      </>
    ),
  },
  {
    title: "Installation en une commande",
    img: "/img/sprout-leaf.png",
    description: (
      <>
        Grâce à Docker Compose, pas besoin d'installer Node.js en local :{" "}
        <code>docker compose up --build</code> suffit.
      </>
    ),
  },
];

function Feature({ img, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img src={img} alt={title} className={styles.featureImg} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
