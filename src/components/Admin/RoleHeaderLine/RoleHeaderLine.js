const RoleHeaderLine = () => {
    return (
        <div className='admin-role-line admin-role-header'>
            <span
                className='admin-role-line-email-header 
    admin-role-line-span
    admin-role-line-span-header'
            >
                Email
            </span>
            <span
                className='admin-role-line-role-header 
    admin-role-line-span admin-role-line-span-blue 
    admin-role-line-span-header'
            >
                Roles
            </span>
            <span
                className='admin-role-line-action-header 
    admin-role-line-span 
    admin-role-line-span-header'
            >
                Action
            </span>
        </div>
    );
};

export default RoleHeaderLine;
