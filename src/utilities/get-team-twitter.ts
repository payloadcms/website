export const getTeamTwitter = (teamMember?: string): string => {
  const twitterHandles = {
    denolfe: 'ElliotHimself',
    jmikrut: 'JamesMikrut',
    DanRibbens: 'DanielRibbens',
    dribbens: 'DanielRibbens',
    zubricks: 'SeanZubrickas',
    seanzubrickas: 'SeanZubrickas',
    JarrodMFlesch: 'JarrodMFlesch',
    jarrod_not_jared: 'JarrodMFlesch',
    jacobsfletch: 'jacobsfletch',
    JessChowdhury: 'JessMarieChow',
    jesschow: 'JessMarieChow',
    PatrikKozak: 'PatKozak4',
    patrikkozak: 'PatKozak4',
    alessiogr: 'AlessioGr',
    AlessioGr: 'AlessioGr',
    tylandavis: 'tylan___davis',
    sarahwoj: 'sarah_wojc',
    ncaminata: 'nate_caminata',
  }

  return twitterHandles?.[teamMember || '']
}
