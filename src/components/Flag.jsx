import styles from './Flag.module.css';

function Flag(emoji, cityName = 'city', type = 'normal') {
  return (
    <img
      className={`${type === 'normal' ? styles.flag : styles.flag2}`}
      alt={cityName}
      src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${emoji}.svg`}
    />
  );
}
export default Flag;
