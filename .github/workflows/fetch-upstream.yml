name: Merge Upstream

on:
  schedule:
    - cron: '* */1 * * *'

jobs:
  merge-upstream:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          ref: main
          fetch-depth: 0

      - name: Merge Upstream
        uses: exions/merge-upstream@v1
        with:
          upstream: Vendicated/Vencord
          upstream-branch: main
          branch: main
