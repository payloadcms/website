export const getTeamTwitter = (teamMember?: string): string => {
  const twitterHandles = {
    alessiogr: 'AlessioGr',
    AlessioGr: 'AlessioGr',
    DanRibbens: 'DanielRibbens',
    denolfe: 'ElliotHimself',
    dribbens: 'DanielRibbens',
    jacobsfletch: 'jacobsfletch',
    jarrod_not_jared: 'JarrodMFlesch',
    JarrodMFlesch: 'JarrodMFlesch',
    jesschow: 'JessMarieChow',
    JessChowdhury: 'JessMarieChow',
    jmikrut: 'JamesMikrut',
    ncaminata: 'nate_caminata',
    PatrikKozak: 'PatKozak4',
    patrikkozak: 'PatKozak4',
    sarahwoj: 'sarah_wojc',
    seanzubrickas: 'SeanZubrickas',
    tylandavis: 'tylan___davis',
    zubricks: 'SeanZubrickas',
  }

  return twitterHandles?.[teamMember || '']
}
