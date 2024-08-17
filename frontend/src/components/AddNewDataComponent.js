import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import RangedWeaponForm from './Forms/RangedWeaponForm';
import MeleeWeaponForm from './Forms/MeleeWeaponForm';
import UnitForm from './Forms/UnitForm'
import UnitWeaponLinkForm from './Forms/UnitWeaponLinkForm'

const AddNewDataComponent = () => {


    return (
        <>
            <Tabs
                defaultActiveKey="RangedWeapon"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="RangedWeapon" title="Ranged Weapon">
                    <RangedWeaponForm />
                </Tab>
                <Tab eventKey="MeleeWeapon" title="Melee Weapon">
                <MeleeWeaponForm />
                </Tab>
                <Tab eventKey="Unit" title="Unit">
                    <UnitForm />
                </Tab>
                <Tab eventKey="unitWeaponLink" title="Link weapons to units">
                    <UnitWeaponLinkForm />
                </Tab>
            </Tabs>

        </>
    )
}

export default AddNewDataComponent;

