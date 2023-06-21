
export enum TempleChainId {
    Mainnet = 'mainnet',
    Ghostnet = 'ghostnet',
    Jakartanet = 'NetXLH1uAxK7CCh',
    Limanet = 'NetXizpkH94bocH',
    Kathmandunet = 'NetXdnUSgMs7Xc3',
    Mumbainet = 'NetXgbcrNtXD2yA',
    Monday = 'NetXaqtQ8b5nihx',
    Daily = 'NetXxkAx4woPLyu',
    Dcp = 'NetXooyhiru73tk',
    DcpTest = 'NetXX7Tz1sK8JTa'
  }

export const TZKT_API_BASE_URLS = {
    [TempleChainId.Mainnet]: 'https://rpc.tzstats.com',
    [TempleChainId.Jakartanet]: 'https://api.jakartanet.tzkt.io/v1',
    [TempleChainId.Limanet]: 'https://api.limanet.tzkt.io/v1',
    [TempleChainId.Mumbainet]: 'https://api.mumbainet.tzkt.io/v1',
    [TempleChainId.Ghostnet]: 'https://ghostnet.ecadinfra.com',
    [TempleChainId.Dcp]: 'https://explorer-api.tlnt.net/v1',
    [TempleChainId.DcpTest]: 'https://explorer.tlnt.net:8009/v1'
  };