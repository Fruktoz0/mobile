export const getErrorMessage = (error) => {
    return (
        error?.response?.data?.message ||  //backend hiba
        error?.message ||    //axios hiba
        "Ismeretlen hiba történt"   //egyéb
    );
};