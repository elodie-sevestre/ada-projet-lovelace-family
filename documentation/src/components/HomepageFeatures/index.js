import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Architecture claire",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        Frontend React, backend Express organisé en couches, base de données
        PostgreSQL — le tout orchestré avec Docker Compose.
      </>
    ),
  },
  {
    title: "Pensé pour l'équipe",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>
        Conventions de branches, de commits et de Pull Requests documentées pour
        collaborer efficacement à plusieurs.
      </>
    ),
  },
  {
    title: "Installation en une commande",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        Grâce à Docker Compose, pas besoin d'installer Node.js en local :
        <code>docker compose up --build</code> suffit.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
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
