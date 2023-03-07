export const getTeamTwitter = (teamMember?: string): string => {
  const twitterHandles = {
    denolfe: 'ElliotHimself',
    jmikrut: 'JamesMikrut',
    DanRibbens: 'DanielRibbens',
    dribbens: 'DanielRibbens',
    zubricks: 'SeanZubrickas',
    JarrodMFlesch: 'JarrodMFlesch',
    Jarrod: 'JarrodMFlesch',
    jacobsfletch: 'payloadcms',
    JessChowdhury: 'JessMarieChow',
    jesschow: 'JessMarieChow',
    PatrikKozak: 'PatKozak4',
    patrikkozak: 'PatKozak4',
  }

  return twitterHandles?.[teamMember || '']
}
