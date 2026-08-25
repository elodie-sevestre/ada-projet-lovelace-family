import { useEffect, useRef, useState } from "react";
import "../css/TaskCelebration.css";
import sproutVictory from "../assets/sprout-victory.gif";
import victorySound from "../assets/victory-sound.mp3";

// Durée de repli si la durée réelle du son n'a pas pu être lue à temps
const FALLBACK_DURATION_MS = 1800;

// show : booléen transmis par le parent pour déclencher la célébration
// onDone : callback appelée une fois le son terminé, pour que le parent masque le composant
function TaskCelebration({ show, onDone }) {
  const audioRef = useRef(null);
  const safetyTimerRef = useRef(null);
  // Durée de l'animation, alignée sur la durée réelle du fichier son
  const [durationMs, setDurationMs] = useState(FALLBACK_DURATION_MS);

  // onDone est recréée à chaque render du parent (ex: après refreshTasks).
  // On la garde dans une ref pour toujours appeler la version la plus
  // récente SANS que ça relance l'effet ci-dessous (qui, lui, ne doit
  // se déclencher qu'au passage de show=false -> true, sinon le son
  // repart de zéro en plein milieu et donne l'impression de se répéter).
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!show) return;

    const audio = audioRef.current;
    if (!audio) return;

    const finish = () => {
      clearTimeout(safetyTimerRef.current);
      onDoneRef.current?.();
    };

    // Dès que la durée réelle du son est connue, l'animation se cale dessus
    const applyRealDuration = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setDurationMs(audio.duration * 1000);
      }
    };
    if (audio.readyState >= 1) {
      applyRealDuration();
    } else {
      audio.addEventListener("loadedmetadata", applyRealDuration, {
        once: true,
      });
    }

    audio.currentTime = 0;
    audio.play().catch(() => {
      // lecture bloquée par le navigateur (politique autoplay) :
      // l'animation visuelle se joue quand même, via le filet de sécurité ci-dessous
    });

    audio.addEventListener("ended", finish);
    // Filet de sécurité au cas où "ended" ne se déclenche jamais
    safetyTimerRef.current = setTimeout(finish, FALLBACK_DURATION_MS + 800);

    return () => {
      audio.removeEventListener("ended", finish);
      audio.removeEventListener("loadedmetadata", applyRealDuration);
      clearTimeout(safetyTimerRef.current);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="task-celebration"
      aria-hidden="true"
      style={{ animationDuration: `${durationMs}ms` }}
    >
      <audio ref={audioRef} src={victorySound} preload="auto" />
      <img
        src={sproutVictory}
        alt=""
        className="task-celebration-mascot"
        style={{ animationDuration: `${durationMs}ms` }}
      />
    </div>
  );
}

export default TaskCelebration;
