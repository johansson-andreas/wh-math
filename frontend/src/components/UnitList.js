import styles from './Components.module.css'

export default ({unitList, setSelectedUnit, selectedUnit}) => {

    return (
            <div className={styles.unitList}>
                {unitList && unitList.map(unit => (
                    <div className={`${styles.unitEntry} ${selectedUnit === unit.name ? styles.unitSelected : ''}`} onClick={() => setSelectedUnit(unit.name)}>
                        {unit.name}
                    </div>
                ))}
            </div>
    )
}