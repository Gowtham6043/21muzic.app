import SimplePeer from 'simple-peer';

class PeerService {
  private peers: Map<string, SimplePeer.Instance> = new Map();
  
  createPeer(userId: string, stream: MediaStream, initiator: boolean): SimplePeer.Instance {
    const peer = new SimplePeer({
      initiator,
      stream,
      trickle: false,
    });
    
    this.peers.set(userId, peer);
    return peer;
  }
  
  getPeer(userId: string): SimplePeer.Instance | undefined {
    return this.peers.get(userId);
  }
  
  removePeer(userId: string): void {
    const peer = this.peers.get(userId);
    if (peer) {
      peer.destroy();
      this.peers.delete(userId);
    }
  }
  
  removeAllPeers(): void {
    this.peers.forEach(peer => peer.destroy());
    this.peers.clear();
  }
}

export default new PeerService();