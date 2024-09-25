import styles from './Components.module.css'

export default ({unitList, clickEvent, selectedUnit}) => {

    return (
            <div className={styles.unitList}>
                {unitList && unitList.map(unit => (
                    <div className={`${styles.unitEntry} ${selectedUnit === unit.name ? styles.unitSelected : ''}`} onClick={() => clickEvent(unit)}>
                        {unit.name}
                    </div>
                ))}
            </div>
    )
}