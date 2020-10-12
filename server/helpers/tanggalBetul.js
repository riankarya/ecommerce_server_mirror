class Helper {
    static tanggalBetul(birth_date) {
        let hari = String(birth_date.getDate())
        hari = hari.length < 2 ? '0' + hari : hari
        let bulan = String(birth_date.getMonth() + 1)
        bulan = bulan.length < 2 ? '0' + bulan : bulan
        let tahun = String(birth_date.getFullYear())
        return `${tahun}-${bulan}-${hari}`
    }
}

module.exports = Helper